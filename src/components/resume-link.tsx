import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { FaDownloadSolid } from "@qwikest/icons/font-awesome";

export default component$((params: { href: string }) => {
  return (
    <Link
      target="_blank"
      type="button"
      href={params.href}
      class="lite:lg:bg-white group absolute top-3 right-14 z-50 p-2 font-semibold text-white/50 hover:text-white/90 lg:text-gray-500 lg:hover:text-gray-900 lg:dark:text-white/50 lg:dark:hover:text-white/90"
    >
      <FaDownloadSolid height={20} width={20} />
    </Link>
  );
});
