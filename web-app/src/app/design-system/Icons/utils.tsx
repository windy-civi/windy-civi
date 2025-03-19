export const makeSvg = (name: string, svgString: string) => {
  const Fn = ({ style }: { style?: React.CSSProperties }) => (
    <div style={style} dangerouslySetInnerHTML={{ __html: svgString }}></div>
  );
  Fn.displayName = name;
  return Fn;
};
