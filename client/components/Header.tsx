import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  className?: string;
}

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 10H3"
      stroke="#212121"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 6H3"
      stroke="#212121"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 14H3"
      stroke="#212121"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 18H3"
      stroke="#212121"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const languageOptions = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" }
];

export function Header({ title, className }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.split("-")[0] || "en";
  const active = languageOptions.find((l) => l.code === current) || languageOptions[0];

  return (
    <div
      className={cn(
        "flex w-full px-3 sm:px-5 py-[14px] justify-between items-center bg-white",
        "shadow-[0_0_30px_0_rgba(41,48,66,0.10)] h-[60px] sm:h-[68px]",
        className,
      )}
    >
      {/* Left side - Menu and Title */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        <MenuIcon />
        <h1 className="text-promag-body font-manrope text-sm sm:text-base font-semibold truncate">
          {title}
        </h1>
      </div>

      {/* Right side - Language + Profile */}
      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:inline-flex items-center gap-2 px-2 h-8 rounded-md border border-[#DDD] bg-white hover:bg-gray-50">
              <span className="text-base">{active.flag}</span>
              <span className="text-xs font-medium text-promag-body">{active.label}</span>
              <ChevronDown />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={current}
              onValueChange={(val) => i18n.changeLanguage(val)}
            >
              {languageOptions.map((opt) => (
                <DropdownMenuRadioItem key={opt.code} value={opt.code}>
                  <span className="mr-2">{opt.flag}</span>
                  {opt.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-2 sm:gap-[10px]">
            {/* Avatar */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <div className="w-full h-full rounded-full bg-promag-primary flex items-center justify-center">
                <span className="text-white font-inter text-sm sm:text-lg font-semibold">
                  JD
                </span>
              </div>
            </div>

            {/* User Info - Hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-promag-body font-inter text-sm font-normal">
                John Doe
              </span>
              <span className="text-promag-body/80 font-inter text-xs font-normal">
                {t("roles.superAdmin")}
              </span>
            </div>
          </div>

          {/* Dropdown Arrow */}
          <div className="hidden sm:block">
            <ChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}
