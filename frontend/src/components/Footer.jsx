const Footer = () => {
  return (
    <footer className="bg-[#131921] text-white text-center py-6 mt-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm mb-2">© {new Date().getFullYear()} ShopBot. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-sm">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
