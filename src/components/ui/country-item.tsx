import * as FlagIcons from 'country-flag-icons/react/3x2';


export const hasFlag = (iso2: string) => {
    const code = iso2.toUpperCase();
    return (FlagIcons as any)[code] ? true : false;
}

export function CountryItem({ iso2, name, dialCode }: { iso2: string; name: string; dialCode?: string }) {
    const code = iso2.toUpperCase();
    // Cada propiedad del objeto FlagIcons es un componente (ej: FlagIcons.US)
    const FlagComponent = (FlagIcons as any)[code];
  
    if (FlagComponent) {
      return (
        <div className="flex items-center gap-2">
        <span className="fi fi-us w-4 h-4 text-2xl"></span>
          <span className="flex-1">{name}</span>
          {dialCode && <span className="text-gray-500">{dialCode}</span>}
        </div>
      );
    }
  
    // Fallback
    return (
      <div className="flex items-center gap-2">
        <span>🏳️</span>
        <span className="flex-1">{name}</span>
        {dialCode && <span className="text-gray-500">{dialCode}</span>}
      </div>
    );
  }