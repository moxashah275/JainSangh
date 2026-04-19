/**
 * Extracts up to two initials from a given name string.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  return String(name || "User")
    .split(" ")
    .map(function (part) {
      return part[0] || "";
    })
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  preferImage = true,
}) {
  // Mapping sizes to Tailwind utility classes for dimensions and font scaling
  const sizeClasses = {
    sm: "w-10 h-10 text-[12px]",
    md: "w-12 h-12 text-[14px]",
    lg: "w-16 h-16 text-[18px]",
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (preferImage && user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user?.name || "User"}
        className={`${selectedSize} rounded-full object-cover border border-slate-200 shadow-sm bg-slate-50 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${selectedSize} rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shadow-sm shadow-teal-600/20 ${className}`}
    >
      {getInitials(user?.name)}
    </div>
  );
}
