export default function Logo() {
  return (
    <div className="w-10 h-10 relative">
      <div className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center text-white font-montserrat font-bold text-2xl">
        A
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
    </div>
  );
}
