import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
type Props = {
  description: string
  label: string
  subLabel: string
  className?: string
  onClick?: () => void
  icon?: React.ReactNode
}

export const DoubleGradientCard = ({
  description,
  label,
  subLabel,
  className,
  onClick,
  icon,
}: Props) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-y-15 overflow-hidden rounded-xl border-[1px] p-5 active:border-indigo-100/50",
        className
      )}
    >
      <div className="z-40 flex flex-col gap-y-2">
        <h2 className="text-2xl font-medium">{label}</h2>
        <p className="text-muted-foreground text-lg">{subLabel}</p>
      </div>
      <div className="z-40 flex items-center justify-between gap-x-10">
        <p className="text-muted-foreground text-md">{description}</p>
        <Button className="size-10 rounded-full bg-blue-500" onClick={onClick}>
          <ArrowRight color="white" />
        </Button>
      </div>
      <div className="radial--double--gradient--cards--top absolute top-0 left-0 z-10 h-full w-6/12" />
      <div className="radial--double--gradient--cards--bottom absolute top-0 right-0 left-1/2 z-0 h-full w-6/12" />
    </div>
  )
}
