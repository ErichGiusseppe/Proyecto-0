import Logo from "./Logo";

const Header = () => {
    return (
        <header className="sticky top-0 z-[20] mx-auto flex w-full items-center justify-between border-white-500 p-8">
            <Logo />
            <h1 className="ml-4">Header</h1> 
        </header>
    )
}
export default Header;