import { XCircle, RefreshCw } from 'lucide-react'

export interface NotificationProps {
  type: "failed" | "retry"
  message: string
  subtext: string
  time: string
}

export function NotificationComponent({ type, message, subtext, time }: NotificationProps) {
  return (
    <div className={`w-64 p-2 rounded-lg border ${type === 'failed' ? 'border-destructive/20 bg-destructive/10' : 'border-warning/20 bg-warning/10'}`}>
      <div className="flex items-start gap-3">
        {type === 'failed' ? (
          <XCircle className="h-5 w-5 text-destructive" />
        ) : (
          <RefreshCw className="h-5 w-5 text-warning" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${type === 'failed' ? 'text-destructive' : 'text-warning'}`}>
            {message}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {subtext}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

