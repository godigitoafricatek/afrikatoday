import StaffSidebar from '@/components/StaffSidebar'

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <StaffSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
