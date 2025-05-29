// eslint-disable-next-line react-refresh/only-export-components
export default function () {
  return (
    <footer className="bg-[#ffc2d1] text-base-content py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between gap-10 text-center md:text-left">
        <div className="md:w-1/2">
          <h4 className="footer-title mb-2">Contact</h4>
          <p>Hotline: 0123 456 789</p>
          <p>Email: flower@shop.vn</p>
        </div>

        <div className="md:w-1/2">
          <h4 className="footer-title mb-2">Links</h4>
          <a className="link link-hover block">Policy</a>
          <a className="link link-hover block">How to Order</a>
        </div>
      </div>
    </footer>
  );
}
