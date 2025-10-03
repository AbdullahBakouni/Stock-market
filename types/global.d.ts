type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
};
type CountrySelectProps = {
  name: string;
  label: string;
  control: Control;
  error?: FieldError;
  required?: boolean;
};
type FormInputProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  register: UseFormRegister;
  error?: FieldError;
  validation?: RegisterOptions;
  disabled?: boolean;
  value?: string;
};
type SelectFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  options: readonly Option[];
  control: Control;
  error?: FieldError;
  required?: boolean;
};
type FooterLinkProps = {
  text: string;
  linkText: string;
  href: string;
};
type WelcomeEmailData = {
  email: string;
  name: string;
  intro: string;
};
type User = {
  id: string;
  name: string;
  email: string;
};
type SignInFormData = {
  email: string;
  password: string;
};
type RawNewsArticle = {
  id: number;
  headline?: string;
  summary?: string;
  source?: string;
  url?: string;
  datetime?: number;
  image?: string;
  category?: string;
  related?: string;
};
type MarketNewsArticle = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  category: string;
  related: string;
  image?: string;
};
type StockWithWatchlistStatus = Stock & {
  isInWatchlist: boolean;
};
type FinnhubSearchResult = {
  symbol: string;
  description: string;
  displaySymbol?: string;
  type: string;
};

type FinnhubSearchResponse = {
  count: number;
  result: FinnhubSearchResult[];
};
type UserForNewsEmail = {
  email: string;
};
type StockDetailsPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};
type WatchlistButtonProps = {
  symbol: string;
  company: string;
  isInWatchlist?: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
};
