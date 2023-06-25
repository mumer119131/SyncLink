import { ButtonProps } from "../../types/interfaces"


const Button = ({children, onClick, className} : ButtonProps) => {
  return (
    <button onClick={onClick} className={className}>{children}</button>
  )
}

export default Button