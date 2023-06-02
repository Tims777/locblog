import formatter from "../services/format.ts";

export interface CommentProps {
  content: string;
  author: string;
  published?: Date;
}

export default function Comment(props: CommentProps) {
  return (
    <div class="w-full flex items-center mb-4">
      <div
        tabIndex={0}
        class="bg-gray-300 rounded-full w-8 h-8 text-center font-mono flex-none"
        title={props.author}
      >
        {props.author[0]}
      </div>
      <div class="relative bg-gray-200 rounded-lg shrink m-2 p-2">
        <div class="text-sm text-center">
          {formatter.format(props.published)}
        </div>
        {props.content}
      </div>
    </div>
  );
}
