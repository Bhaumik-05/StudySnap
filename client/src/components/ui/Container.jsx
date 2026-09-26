function Container({ children, className = "" }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1400px] px-5 sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;