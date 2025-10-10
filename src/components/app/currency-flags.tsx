
const EuroFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#003399"/>
        <g transform="translate(16,16)">
            <g fill="#FFCC00">
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(18)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(54)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(90)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(126)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(162)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(198)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(234)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(270)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-L2.72 2.36 9.24-1.18z" transform="rotate(306)"/>
            <path d="M0-12l3.52 10.82L-9.24 2.36h22.48L-12.72 2.36 9.24-1.18z" transform="rotate(342)"/>
            </g>
        </g>
    </svg>
);

const JapanFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#fff"/>
        <circle cx="16" cy="16" r="9.6" fill="#bc002d"/>
    </svg>
);

const USFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#b22234"/>
        <path fill="#fff" d="M0 16A16 16 0 0 1 16 0v32A16 16 0 0 1 0 16z"/>
        <circle cx="8" cy="16" r="8" fill="#3c3b6e"/>
        <g fill="#fff" transform="translate(8,16) scale(0.8)">
            <g>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(0, 2.5) scale(0.5)"/>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(2.5, 1.5) scale(0.5)"/>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(2.5, -1.5) scale(0.5)"/>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(0, -2.5) scale(0.5)"/>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(-2.5, -1.5) scale(0.5)"/>
                <path d="M-1.5-3l.5 1.5h-2l1.5-1z" transform="translate(-2.5, 1.5) scale(0.5)"/>
            </g>
        </g>
    </svg>
);


type CurrencyFlagsProps = {
    asset: string;
};

export const CurrencyFlags = ({ asset }: CurrencyFlagsProps) => {
    const [currency1, currency2] = asset.split('/');

    const getFlag = (currency: string) => {
        switch (currency) {
            case 'EUR':
                return <EuroFlag />;
            case 'USD':
                return <USFlag />;
            case 'JPY':
                return <JapanFlag />;
            default:
                return null;
        }
    };

    return (
        <div className="flex -space-x-2">
            {getFlag(currency1)}
            {getFlag(currency2)}
        </div>
    );
};
