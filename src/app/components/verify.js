export async function getServerSideProps({ req }) {
    const router = useRouter();
    const token = req.cookies.authToken;

    const decodedToken = verifyToken(token);

    if (decodedToken) {
        router.push('/login')

        const user = { email: decodedToken.email };
        return {
            props: { user },
        };
    } else {
        router.push('/login');
    }
}