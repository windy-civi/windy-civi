export const Support = () => {
  return (
    <>
      <div className="flex justify-center mt-4">
        <a
          href="/"
          className="bg-purple-700 p-2 rounded-lg text-white uppercase font-bold cursor-pointer"
        >
          Go Back To Windy Civi
        </a>
      </div>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfrlnk76_u6VgNf_Bl4FypnBVZziraUQ7tgeVtnJxTWg8z6nw/viewform?embedded=true"
        width="100%"
        height="700px"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
      >
        Loading…
      </iframe>
    </>
  );
};
