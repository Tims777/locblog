export interface PostcardProps {
  image?: string,
  title?: string,
  href?: string,
}

export default function Postcard(props: PostcardProps) {
  const containerClasses = [
    "relative",
    "block",
    "aspect-[3/2]", // aspect-postcard
    "bg-gray-500",
    `bg-[url('${props.image}')]`,
    "bg-cover",
    "mb-4",
    "shadow-lg",
    "shadow-gray-500",
    "transition",
    "hover:rotate-1",
  ];
  return (
    <a href={props.href} class={containerClasses.join(" ")}>
      <h2 class="absolute bottom-0 w-full p-2 text-xl text-white text-center font-mono bg-gradient-to-t from-black">
        {props.title}
      </h2>
    </a>
  );
}

function summarize(content: string) {
  const paragraphs = content.split("\n").filter((l) =>
    l && !l.startsWith("#") && !l.startsWith(":")
  );
  let words = paragraphs.length ? paragraphs[0].split(" ") : [];
  const maxWords = 42;
  if (words.length > maxWords) {
    words = words.slice(0, maxWords);
    words.push("...");
  }
  return words.join(" ");
}
