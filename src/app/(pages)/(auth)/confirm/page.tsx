import ConfirmEmailContainer from "@/app/domains/auth/containers/ConfirmEmailContainer";

type SearchParams = Promise<{ email?: string }>;

export default async function ConfirmPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const email = searchParams.email ?? "your email";

  return (
    <section className="max-w-lg mx-auto min-h-screen flex flex-col justify-center items-center px-6">
      <ConfirmEmailContainer email={email} />
    </section>
  );
}
