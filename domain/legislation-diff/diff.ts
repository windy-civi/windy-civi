import {
  CiviLegislationDataForDiff,
  LegislationChange,
  Sponsor,
} from "../../domain";

// Some of our data (check Chicago), doesn't have role/district data
// todo: we should probably clean up sponsored to have a unique id generated.
function areSponsorsEqual(
  sponsor1: Partial<Sponsor>,
  sponsor2: Partial<Sponsor>
): boolean {
  return (
    (!sponsor1.name || !sponsor2.name || sponsor1.name === sponsor2.name) &&
    (!sponsor1.role || !sponsor2.role || sponsor1.role === sponsor2.role) &&
    (!sponsor1.district ||
      !sponsor2.district ||
      sponsor1.district === sponsor2.district)
  );
}

export function findDifferences(
  prevBills: CiviLegislationDataForDiff[],
  updatedBills: CiviLegislationDataForDiff[]
): LegislationChange[] {
  const differences: LegislationChange[] = [];

  const updatedBillsById = new Map(updatedBills.map((item) => [item.id, item]));
  const prevBillsById = new Map(prevBills.map((item) => [item.id, item]));

  // Check for removed bills
  for (const prevBill of prevBills) {
    if (prevBill.id && !updatedBillsById.has(prevBill.id)) {
      differences.push({
        id: prevBill.id,
        differences: { removed: true },
      });
    }
  }

  // Check for added bills
  for (const newBill of updatedBills) {
    if (newBill.id && !prevBillsById.has(newBill.id)) {
      differences.push({
        id: newBill.id,
        differences: { added: true },
      });
    }
  }

  // Check for differences in common bills
  for (const prevBill of prevBills) {
    const newBill = updatedBillsById.get(prevBill.id);

    if (prevBill.id && newBill) {
      const differencesForItem: LegislationChange["differences"] = {};

      // Compare the status arrays
      if (!prevBill.status && Array.isArray(newBill.status)) {
        differencesForItem.status = {
          previous: null,
          new: newBill.status,
        };
      } else if (
        Array.isArray(prevBill.status) &&
        Array.isArray(newBill.status)
      ) {
        if (
          prevBill.status.length !== newBill.status.length ||
          !prevBill.status.every(
            (value, index) =>
              Array.isArray(newBill.status) && value === newBill.status[index]
          )
        ) {
          differencesForItem.status = {
            previous: prevBill.status,
            new: newBill.status,
          };
        }
      }

      // Compare the statusDate field
      if (newBill.statusDate && prevBill.statusDate !== newBill.statusDate) {
        differencesForItem.statusDate = {
          previous: prevBill.statusDate || null,
          new: newBill.statusDate,
        };
      }

      // Compare the sponsors array for added and removed items
      if (!prevBill.sponsors && Array.isArray(newBill.sponsors)) {
        differencesForItem.sponsors = {
          added: newBill.sponsors,
          removed: null,
        };
      } else if (
        Array.isArray(prevBill.sponsors) &&
        Array.isArray(newBill.sponsors)
      ) {
        const sponsoredAdded = newBill.sponsors.filter(
          (s) =>
            Array.isArray(prevBill.sponsors) &&
            !prevBill.sponsors.some((p) => areSponsorsEqual(p, s))
        );
        const sponsoredRemoved = prevBill.sponsors.filter(
          (s) =>
            Array.isArray(newBill.sponsors) &&
            !newBill.sponsors.some((p) => areSponsorsEqual(p, s))
        );
        if (sponsoredAdded.length > 0 || sponsoredRemoved.length > 0) {
          differencesForItem.sponsors = {
            added: sponsoredAdded,
            removed: sponsoredRemoved,
          };
        }
      }

      if (Object.keys(differencesForItem).length > 0) {
        differences.push({ id: prevBill.id, differences: differencesForItem });
      }
    }
  }

  return differences;
}
