import { CustomSection } from "../../design-system";

export const Contribute = () => {
  return (
    <CustomSection title="About Us">
      <div className="max-w-screen-md text-center mb-8">
        <p className="mb-4 text-white">
          We are a non-profit open source project that is built at Chi Hack
          Night, Chicago's weekly gathering for civic tech enthusiasts. Our
          mission is to make local legislation more accessible and engaging for
          everyone.
        </p>
        <div className="flex flex-wrap flex-col justify-center gap-4">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfrlnk76_u6VgNf_Bl4FypnBVZziraUQ7tgeVtnJxTWg8z6nw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Submit Comments / Feedback
          </a>
          <a
            href="https://github.com/windy-civi/windy-civi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Report a Bug
          </a>
          <a
            href="https://github.com/windy-civi/windy-civi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
          >
            Contribute Code
          </a>
          <a
            href="https://chihacknight.slack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
          >
            Join our Slack
          </a>
        </div>
      </div>
    </CustomSection>
  );
};
