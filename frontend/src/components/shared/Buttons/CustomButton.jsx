
const CustomButton = ({width, color, bgColor, content, action, fontSize, icon }) => {
  return (
    <button style={{width, color, backgroundColor: bgColor, fontSize}}>{icon} {content}</button>
  )
}

export default CustomButton