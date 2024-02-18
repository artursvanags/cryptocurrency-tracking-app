export const colorizeSearchTerm = (name: string, searchTerm: string) => {
    return name
      .split(new RegExp(`(${searchTerm})`, 'gi'))
      .map((part: string, index: number) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} className="bg-secondary font-bold">
            {part}
          </span>
        ) : (
          part
        )
      );
  };
