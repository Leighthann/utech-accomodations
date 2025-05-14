{
    user && (
        <>
            <Link
                href="/favorites"
                className="text-gray-700 hover:text-[#002f6c] transition-colors"
            >
                Favorites
            </Link>
            <Link
                href="/messages"
                className="text-gray-700 hover:text-[#002f6c] transition-colors"
            >
                Messages
            </Link>
            <Link
                href="/compare"
                className="text-gray-700 hover:text-[#002f6c] transition-colors"
            >
                Compare
            </Link>
            <Link
                href="/saved-searches"
                className="text-gray-700 hover:text-[#002f6c] transition-colors"
            >
                Saved Searches
            </Link>
            {user.role === "landlord" && (
                <Link
                    href="/landlord/dashboard"
                    className="text-gray-700 hover:text-[#002f6c] transition-colors"
                >
                    Dashboard
                </Link>
            )}
        </>
    )
} 