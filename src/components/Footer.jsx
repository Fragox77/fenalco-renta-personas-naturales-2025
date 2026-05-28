export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg grid place-items-center text-white font-display font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #280071 0%, #4316C8 100%)' }}>R</span>
          <div>
            <div className="font-display font-bold text-sm">Renta<span className="text-fen-green">·</span>25</div>
            <div className="font-mono text-[10px] text-white/45 tracking-[0.12em] uppercase">by Fenalco Santander</div>
          </div>
        </div>
        <div className="text-xs text-white/55 max-w-md">
          © Fenalco Santander · Cra. 20 #36-49 · Bucaramanga<br />
          educacioncontinua@fenalcosantander.com.co
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="flex items-center gap-3">
            <a href="https://fenalcosantander.com.co/formacion/" target="_blank" rel="noreferrer"
               className="text-xs text-white/65 hover:text-white">Sitio oficial</a>
            <a href="tel:+573102355262" className="text-xs text-white/65 hover:text-white">+57 310 235 5262</a>
          </div>
          <div className="font-mono text-[10px] text-white/40 tracking-[0.12em]">RPN · 25</div>
        </div>
      </div>
    </footer>
  );
}
