const Loader = ({ text = "Loading..." }) => {
  return (
    <div style={{ padding: "1rem 0", fontSize: "0.95rem", opacity: 0.8 }}>
      {text}
    </div>
  );
};

export default Loader;
