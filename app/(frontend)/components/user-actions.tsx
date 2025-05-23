import DeleteButton from './delete-button'
import ModifyButton from './modify-button'

// Debugging: Log the imported components
console.log('DeleteButton:', DeleteButton)
console.log('ModifyButton:', ModifyButton)

export default function UserActions({ userId }: { userId: string }) {
  return (
    <div className="flex space-x-4">
      <DeleteButton userId={userId} />
      <ModifyButton userId={userId} />
    </div>
  )
}