import assert from "assert";
import { CiviLegislationDataForDiff, LegislationChange } from "..";
import { findDifferences } from "./diff";

const tests: {
  given: string;
  should: string;
  expected: LegislationChange[];
  prevMock: CiviLegislationDataForDiff[];
  nextMock: CiviLegislationDataForDiff[];
}[] = [
  {
    given: "no diff",
    should: "return empty array",
    expected: [],
    prevMock: [
      {
        id: "HB2",
        status: ["Pass"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        status: ["Pass"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
  },

  {
    given: "status date change",
    should: "return that status date",
    expected: [
      {
        id: "HB2",
        differences: {
          statusDate: {
            previous: "2024-05-15",
            new: "2025-05-15",
          },
        },
      },
    ],
    prevMock: [
      {
        id: "HB2",
        status: ["Pass"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        status: ["Pass"],
        statusDate: "2025-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
  },

  {
    given: "status changed",
    should: "return that statuses that changed",
    expected: [
      {
        id: "HB2",
        differences: {
          status: {
            previous: ["Engrossed"],
            new: ["Pass"],
          },
        },
      },
    ],
    prevMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        status: ["Pass"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
        ],
      },
    ],
  },

  {
    given: "added and removed sponsors",
    should: "return that sponsors that changed",
    expected: [
      {
        id: "HB2",
        differences: {
          sponsors: {
            added: [
              {
                name: "Julia L",
                role: "Rep",
                district: "ocd-division/country:us/state:la/cd:5",
              },
            ],
            removed: [
              {
                name: "Ronny Jackson",
                role: "Rep",
                district: "ocd-division/country:us/state:tx/cd:13",
              },
            ],
          },
        },
      },
    ],
    prevMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
          {
            name: "Ronny Jackson",
            role: "Rep",
            district: "ocd-division/country:us/state:tx/cd:13",
          },
        ],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "Rep",
            district: "ocd-division/country:us/state:fl/cd:26",
          },
          {
            name: "Julia L",
            role: "Rep",
            district: "ocd-division/country:us/state:la/cd:5",
          },
        ],
      },
    ],
  },

  {
    given: "added and removed sponsors with missing data (i.e. from chicago)",
    should: "return that sponsors that changed",
    expected: [
      {
        id: "HB2",
        differences: {
          sponsors: {
            added: [
              {
                name: "Julia L",
                role: "",
                district: "",
              },
            ],
            removed: [
              {
                name: "Ronny Jackson",
                role: "",
                district: "",
              },
            ],
          },
        },
      },
    ],
    prevMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "",
            district: "",
          },
          {
            name: "Ronny Jackson",
            role: "",
            district: "",
          },
        ],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "",
            district: "",
          },
          {
            name: "Julia L",
            role: "",
            district: "",
          },
        ],
      },
    ],
  },
  {
    given: "added bill",
    should: "return added bill",
    expected: [
      {
        id: "HB2",
        differences: {
          added: true,
        },
      },
    ],
    prevMock: [],
    nextMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "",
            district: "",
          },
          {
            name: "Julia L",
            role: "",
            district: "",
          },
        ],
      },
    ],
  },

  {
    given: "removed bill",
    should: "returns removed bill",
    expected: [
      {
        id: "HB2",
        differences: {
          removed: true,
        },
      },
    ],
    nextMock: [],
    prevMock: [
      {
        id: "HB2",
        status: ["Engrossed"],
        statusDate: "2024-05-15",
        sponsors: [
          {
            name: "Mario D",
            role: "",
            district: "",
          },
          {
            name: "Julia L",
            role: "",
            district: "",
          },
        ],
      },
    ],
  },
  {
    given: "bad status data (sometimes we dont have the data proper)",
    should: "return return bill still",
    expected: [],
    prevMock: [
      {
        id: "HB2",
        sponsors: [],
      },
    ],
    nextMock: [
      {
        id: "HB2",
        sponsors: [],
      },
    ],
  },
];

// Test runner
function runTests() {
  let allTestsPassed = true;

  tests.forEach((test) => {
    const name = `given ${test.given}, it should ${test.should}`;
    const diff = findDifferences(test.prevMock, test.nextMock);

    try {
      assert.deepStrictEqual(diff, test.expected, name);
      console.log(`✅ ${name}`);
    } catch (error) {
      console.error(`❌ ${name}`);
      console.error(`actual: ${JSON.stringify(diff, null, 2)} `);
      console.error(`expected: ${JSON.stringify(test.expected, null, 2)} `);
      allTestsPassed = false;
    }
  });

  // Exit with code 1 if any test failed
  if (!allTestsPassed) {
    process.exit(1);
  }
}

runTests();
