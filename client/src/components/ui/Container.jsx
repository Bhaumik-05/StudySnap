function Container({ className = "", children, ...props }) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--content-width)] px-6 md:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
