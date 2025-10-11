
const EuroFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#003399"/>
        <g transform="translate(16,16) scale(0.8)">
            <g fill="#FFCC00">
                <path id="star" d="M0-12l3.52 10.82L-9.24 2.36h18.48L3.52 10.82z"/>
                <use href="#star" transform="rotate(36)"/>
                <use href="#star" transform="rotate(72)"/>
                <use href="#star" transform="rotate(108)"/>
                <use href="#star" transform="rotate(144)"/>
                <use href="#star" transform="rotate(180)"/>
                <use href="#star" transform="rotate(216)"/>
                <use href="#star" transform="rotate(252)"/>
                <use href="#star" transform="rotate(288)"/>
                <use href="#star" transform="rotate(324)"/>
                 <use href="#star" transform="rotate(360)"/>
            </g>
        </g>
    </svg>
);


const JapanFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
        <rect x="0" y="0" width="32" height="32" fill="#fff" rx="16"/>
        <circle cx="16" cy="16" r="6.4" fill="#bc002d"/>
    </svg>
);


const USFlag = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="clip_usa">
                <circle cx="16" cy="16" r="16" />
            </clipPath>
        </defs>
        <g clipPath="url(#clip_usa)">
            <rect width="32" height="32" fill="#B22234" />
            <path d="M0,4H32 M0,8H32 M0,12H32 M0,20H32 M0,24H32 M0,28H32" stroke="#FFFFFF" strokeWidth="2.6" />
            <rect width="16" height="18" fill="#3C3B6E" />
            <g fill="#FFFFFF">
                <g transform="translate(2, 2.5)">
                    <g className="stars">
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(4,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(8,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(12,0) scale(1.6)"/>
                    </g>
                    <g className="stars" transform="translate(-2, 3)">
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(4,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(8,0) scale(1.6)"/>
                         <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(12,0) scale(1.6)"/>
                    </g>
                    <g className="stars" transform="translate(0, 6)">
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(4,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(8,0) scale(1.6)"/>
                         <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(12,0) scale(1.6)"/>
                    </g>
                     <g className="stars" transform="translate(-2, 9)">
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(4,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(8,0) scale(1.6)"/>
                         <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(12,0) scale(1.6)"/>
                    </g>
                     <g className="stars" transform="translate(0, 12)">
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(4,0) scale(1.6)"/>
                        <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(8,0) scale(1.6)"/>
                         <path d="M0,-1.6 l.47,.36 -.18,-.58 .47,.36 -.18,-.58" transform="translate(12,0) scale(1.6)"/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);

const GBPFlag = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="clip_gbp"><circle cx="16" cy="16" r="16" /></clipPath></defs>
        <g clipPath="url(#clip_gbp)">
            <rect width="32" height="32" fill="#012169"/>
            <path d="M0,0L32,32M32,0L0,32" stroke="#FFF" strokeWidth="6"/>
            <path d="M0,0L32,32M32,0L0,32" stroke="#C8102E" strokeWidth="4"/>
            <path d="M16,0V32M0,16H32" stroke="#FFF" strokeWidth="10"/>
            <path d="M16,0V32M0,16H32" stroke="#C8102E" strokeWidth="6"/>
        </g>
    </svg>
);

const AUDFlag = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="clip_aud"><circle cx="16" cy="16" r="16" /></clipPath></defs>
        <g clipPath="url(#clip_aud)">
            <rect width="32" height="32" fill="#00008B"/>
            <g transform="translate(4 4) scale(0.4)">
                <g fill="#fff">
                    <path d="M0,0L32,16M16,0L0,32" stroke="#fff" strokeWidth="6" transform="scale(2.5 1.25)"/>
                    <path d="M0,0L32,16M16,0L0,32" stroke="#C8102E" strokeWidth="4" transform="scale(2.5 1.25)"/>
                    <path d="M16,0V32M0,16H32" stroke="#fff" strokeWidth="10" transform="scale(1.25 2.5)"/>
                    <path d="M16,0V32M0,16H32" stroke="#C8102E" strokeWidth="6" transform="scale(1.25 2.5)"/>
                </g>
            </g>
             <g fill="#FFF">
                <path d="M22,18 l-1.7-1.2-1.7,1.2.6-2-1.3-1.5,2.1-.1.9-2.1.9,2.1,2.1.1-1.3,1.5z"/>
                <path d="M26,24 l-1.7-1.2-1.7,1.2.6-2-1.3-1.5,2.1-.1.9-2.1.9,2.1,2.1.1-1.3,1.5z"/>
                <path d="M19,27 l-1.7-1.2-1.7,1.2.6-2-1.3-1.5,2.1-.1.9-2.1.9,2.1,2.1.1-1.3,1.5z" transform="scale(0.7) translate(10 12)"/>
             </g>
        </g>
    </svg>
);


const CADFlag = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="clip_cad"><circle cx="16" cy="16" r="16" /></clipPath></defs>
        <g clipPath="url(#clip_cad)">
            <rect width="32" height="32" fill="#FFF"/>
            <rect width="8" height="32" fill="#FF0000"/>
            <rect x="24" width="8" height="32" fill="#FF0000"/>
            <path d="M16,19.5l-2.5-3, -1.5, -5, -4.5,1, 1,3, -3,2, 4,5, 2.5,-2, 4,4, -1,-4, 2.5,-2.5, -3.5, -2, -1, 3 z" fill="#FF0000"/>
        </g>
    </svg>
);


type CurrencyFlagsProps = {
    asset: string;
};

export const CurrencyFlags = ({ asset }: CurrencyFlagsProps) => {
    const [currency1, currency2] = asset.replace(' (OTC)', '').split('/');

    const getFlag = (currency: string) => {
        switch (currency) {
            case 'EUR':
                return <EuroFlag />;
            case 'USD':
                return <USFlag />;
            case 'JPY':
                return <JapanFlag />;
            case 'GBP':
                return <GBPFlag />;
            case 'AUD':
                return <AUDFlag />;
            case 'CAD':
                return <CADFlag />;
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
