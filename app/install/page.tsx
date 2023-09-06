import Modal from "@/components/utils/Modal"

function install() {
    const title="Add To Home Screen";
    const content="To install the app, you need to add this website to your home screen. In your browser, tap the share icon and choose “Add to Home” Screen in the option.Then open the app on your home screen."
  return (
    <Modal title={title} content={content} />
  )
}

export default install