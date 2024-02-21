import CryptocurrencyTableTemplate from '@/components/cryptocurrency-table/template';

export default function Home() {
  return (
    <div className="flex max-h-screen min-h-screen">
      <div className="mx-auto my-auto">
        <CryptocurrencyTableTemplate />
      </div>
    </div>
  );
}
