const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-3',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`${sizes[size]} border-slate-700 border-t-purple-500 rounded-full animate-spin`}></div>
            {text && <p className="mt-4 text-slate-400">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
