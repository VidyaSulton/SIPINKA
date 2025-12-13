import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({children}){
    return(
        <div className="min h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            <AdminSidebar/>
            
            <div className="lg:pl-64">
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}