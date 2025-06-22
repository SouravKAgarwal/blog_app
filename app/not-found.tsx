import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <section className="pink_container !min-h-[calc(100dvh)]">
        <p className="subtitle text-red-600">404</p>
        <h1 className="heading">Page not found</h1>
        <p className="sub-heading !max-w-5xl">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/" className="startup-card_btn">
            Go back home
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
