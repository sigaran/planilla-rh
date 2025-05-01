import {
  LucideProps,
  User,
  ArrowRight,
  FileText,
  UserPlus,
  Check,
  CreditCard,
  HelpCircle,
  Plus,
  Settings,
  Trash,
  X,
  RefreshCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";

export type IconKeys = keyof typeof Icons;

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
  ),
  user: User,
  arrowRight: ArrowRight,
  fileText: FileText,
  userPlus: UserPlus,
  check: Check,
  creditCard: CreditCard,
  settings: Settings,
  help: HelpCircle,
  add: Plus,
  trash: Trash,
  close: X,
  refresh: RefreshCcw,
  warning: AlertCircle,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsLeft: ChevronsLeft,
  chevronsRight: ChevronsRight,
  spinner: Loader2,
}; 