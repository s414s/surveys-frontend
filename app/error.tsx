'use client';

// https://nextjs.org/docs/app/api-reference/file-conventions/error
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error }: { error: Error & { digest?: string; }; }) {
    try {
        console.log("invalidKey"); // This will throw an error
    } catch (error) {
        console.error(`An unknown error occurred`, error);
    }

    const router = useRouter();
    useEffect(() => { console.error(error); }, [error]);

    return (
        <div className='h-full w-full flex flex-col items-center justify-center text-blue-900 max-w-80 mx-auto'>
            <div className='min-w-80 max-w-100 border border-blue-900 bg-blue-50 rounded-md p-5 shadow-xl'>
                <h2 className='font-semibold text-xl text-center'>Algo salió mal...</h2>
                <p className='py-3 text-sm'>
                    Oops... An unexpected error happened
                </p>
                <button
                    className='bg-blue-900 text-blue-50 p-2 rounded-md w-full'
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}