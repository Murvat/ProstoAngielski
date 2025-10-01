import ConfirmEmailContainer from "@/app/domains/auth/containers/ConfirmEmailContainer";

type ConfirmPageProps = {
  searchParams?: { email?: string };
};

export default function Page({ searchParams }: ConfirmPageProps) {
  const email = searchParams?.email ?? "your email";

  return (
    <section className="max-w-lg mx-auto min-h-screen flex flex-col justify-center items-center px-6">
      <ConfirmEmailContainer email={email} />
    </section>
  );
}
