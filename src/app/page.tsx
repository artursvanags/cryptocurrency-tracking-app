import CryptocurrencyTemplate from '@/components/main/template';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="mt-32 w-full pb-4 text-center">
        <h1 className="text-4xl font-bold">Cryptocurrency Tracking App</h1>
        <p className="text-lg text-muted-foreground">
          A simple cryptocurrency tracking app using CoinGecko API
        </p>
      </div>
      <div className="mt-4 w-full max-w-4xl px-4">
        <CryptocurrencyTemplate />
      </div>
    </div>
  );
}
