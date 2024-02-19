import ThemeSwitcher from "@/components/theme-switcher";
import ProfileMenu from "@/layouts/profile-menu";

export default function HeaderMenuRight() {
  return (
    <div className="ms-auto flex justify-end items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <ThemeSwitcher />
      <ProfileMenu />
    </div>
  );
}
