import config from "@/config";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <h1 className="text-4xl font-bold">{config.appName}</h1>
      <p className="text-lg text-gray-500">{config.appDescription}</p>
    </div>
  );
}
