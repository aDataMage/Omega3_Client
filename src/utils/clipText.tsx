import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const clipText = (text: string, length = 3) => {
  console.log("text", text, length);
  const words = text.split(" ");
  const clippedName = words.slice(0, length).join(" ");
  const needsClipping = words.length > length;

  if (needsClipping) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="truncate max-w-[300px]">{clippedName}...</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <span>{text}</span>;
};
