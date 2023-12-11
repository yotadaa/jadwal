import { ReactNode } from 'react';


interface PropsLayout {
    children: ReactNode,
    style: Object,
}

export default function FixedContainer({ children, style }: PropsLayout) {
    return (
        <div
            className='fixed fixed-container top-0 left-0 w-screen h-screen flex items-center justify-center'
            style={style}
        >
            {children}
        </div>
    )
}