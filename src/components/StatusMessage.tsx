import './StatusMessage.css'

interface StatusMessageProps {
  type: 'loading' | 'error' | 'info'
  text: string
}

/** הודעת מצב אחידה לכל העמודים: טוען / שגיאה / מידע (למשל "לא נמצאו ערים") */
function StatusMessage({ type, text }: StatusMessageProps) {
  return (
    // role="alert" — קורא מסך מקריא שגיאות מיד
    <p className={`status-message status-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && '⏳ '}
      {type === 'error' && '⚠️ '}
      {text}
    </p>
  )
}

export default StatusMessage
