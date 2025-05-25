
const Toaster = ({ toaster }) =>
  toaster.show && (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white z-50 ${
        toaster.type === 'success'
          ? 'bg-emerald-600'
          : toaster.type === 'error'
          ? 'bg-red-600'
          : toaster.type === 'warning'
          ? 'bg-yellow-600'
          : 'bg-blue-600'
      }`}
    >
      {toaster.message}
    </div>
  );

export default Toaster;