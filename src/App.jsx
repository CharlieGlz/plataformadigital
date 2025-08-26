import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BarChart3, FileBarChart2, ShieldCheck, Settings, Filter, Download, Bell, CheckCircle2 } from "lucide-react";
import InventarioPage from './pages/Inventario'
import { Modal } from '@/components/ui/modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import libroRaw from "../LibroK1.txt?raw";
import libroCsvRaw from "../Libro1.csv?raw";
import tablaRaw from "../tabla.csv?raw";

const kpiMeta = {
  errores: 50,
  tiempos: 45,
  trazabilidad: 90,
  duplicidad: 80,
  adopcion: 85,
  ejecucion: 100,
};

const kpiResultado = {
  errores: 55,
  tiempos: 52,
  trazabilidad: 92,
  duplicidad: 83,
  adopcion: 88,
  ejecucion: 100,
};

const lineData = [
  { mes: "May", trazabilidad: 55, adopcion: 45 },
  { mes: "Jun", trazabilidad: 70, adopcion: 60 },
  { mes: "Jul", trazabilidad: 82, adopcion: 72 },
  { mes: "Ago", trazabilidad: 92, adopcion: 88 },
];

const metaVsResultado = [
  { kpi: "Errores", meta: kpiMeta.errores, resultado: kpiResultado.errores },
  { kpi: "Tiempos", meta: kpiMeta.tiempos, resultado: kpiResultado.tiempos },
  { kpi: "Trazabilidad", meta: kpiMeta.trazabilidad, resultado: kpiResultado.trazabilidad },
  { kpi: "Duplicidad", meta: kpiMeta.duplicidad, resultado: kpiResultado.duplicidad },
  { kpi: "Adopción", meta: kpiMeta.adopcion, resultado: kpiResultado.adopcion },
  { kpi: "Ejecución", meta: kpiMeta.ejecucion, resultado: kpiResultado.ejecucion },
];

const eventos = [
  { fecha: "2025-07-28", area: "Finanzas", usuario: "A. Morales", accion: "Aprobó reporte semanal" },
  { fecha: "2025-07-28", area: "Calidad", usuario: "L. Pérez", accion: "Registró incidente de duplicidad" },
  { fecha: "2025-07-27", area: "Producción", usuario: "M. Díaz", accion: "Validó consumo de MP" },
  { fecha: "2025-07-27", area: "Auditoría", usuario: "C. Núñez", accion: "Revisó bitácora de accesos" },
];

// Datos de ejemplo (mock) usados cuando no hay datos reales
const MOCK_PARTS = [
  { numero: 'BC921-62010', proyecto: 'MOBIS', descripcion: 'HOUSING - STD, LH', precio: 28.52, responsable: 'Operaciones' },
  { numero: '84731-M7100WK', proyecto: 'MOBIS', descripcion: 'BRAKE PAD SET', precio: 43.83, responsable: 'Calidad' },
  { numero: '1245-AX12', proyecto: 'PLATAFORMA', descripcion: 'SENSOR TEMP', precio: 12.5, responsable: 'Ingeniería' },
  { numero: 'X900-88', proyecto: 'INTEGRACIÓN', descripcion: 'CABLE HARNESS', precio: 7.2, responsable: 'Logística' },
  { numero: 'Z33-77', proyecto: 'MOBIS', descripcion: 'VALVE ASSEMBLY', precio: 96.0, responsable: 'Producción' },
  { numero: 'A12-345', proyecto: 'PLATAFORMA', descripcion: 'CONNECTOR', precio: 3.5, responsable: 'Ingeniería' },
  { numero: 'B77-212', proyecto: 'MOBIS', descripcion: 'HOSE', precio: 5.75, responsable: 'Operaciones' },
  { numero: 'C88-999', proyecto: 'INTEGRACIÓN', descripcion: 'BRACKET', precio: 2.25, responsable: 'Logística' },
  { numero: 'D01-555', proyecto: 'PLATAFORMA', descripcion: 'FUSE', precio: 1.5, responsable: 'Calidad' },
  { numero: 'E22-000', proyecto: 'MOBIS', descripcion: 'COIL SPRING', precio: 18.0, responsable: 'Producción' },
  { numero: 'F33-111', proyecto: 'MOBIS', descripcion: 'INYECCIÓN', precio: 45.0, responsable: 'Operaciones' },
  { numero: 'G44-222', proyecto: 'INTEGRACIÓN', descripcion: 'PLATE', precio: 6.0, responsable: 'Ingeniería' }
];

// Cargar inventario desde Libro1.csv (preferido) o LibroK1.txt
const PARTS = (() => {
  const rows = [];
  try {
    // helper: eliminar BOM, replacement chars y caracteres que no forman parte
    // del alfabeto latin básico; colapsar espacios. Esto evita símbolos "cuadro".
    const sanitize = (s = "") => {
      return String(s)
        .replace(/^\uFEFF|\uFFFE/g, '')
        .replace(/\uFFFD/g, '')
        .replace(/[^\u0009\u0020-\u024F]/g, '')
        .replace(/[\t\n\r]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const parseCSV = (rawCsv) => {
      const out = [];
      if (!rawCsv) return out;
      const lines = rawCsv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // no header expected in provided CSV; if header present and contains non alnum, skip
      for (const line of lines) {
        // split respecting quotes
        const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.trim());
        if (cols.length < 4) continue;
        // remove surrounding quotes
        const cleaned = cols.map(c => c.replace(/^\"|\"$/g, ''));
        const numero = sanitize(cleaned[0] || '');
        const proyecto = sanitize(cleaned[1] || '');
        const descripcion = sanitize(cleaned.slice(2, cleaned.length - 2 + 1).join(' ') || cleaned[2] || '');
        const precioRaw = (cleaned[cleaned.length - 2] || '').replace(/\s/g, '');
        const responsable = sanitize(cleaned[cleaned.length - 1] || '');
        const parsedPrice = (() => {
          if (!precioRaw) return null;
          const cleanedP = precioRaw.replace(/[^0-9,.-]/g, '').replace(/,/g, '.');
          const n = parseFloat(cleanedP);
          return Number.isFinite(n) ? n : null;
        })();
        out.push({ numero, proyecto, descripcion, precio: parsedPrice, responsable });
      }
      return out;
    };

    // prefer `tabla.csv` if present (user-provided quick table)
    if (typeof tablaRaw === 'string' && tablaRaw.trim().length > 0) {
      const parsed = parseCSV(tablaRaw);
      return parsed;
    }

    // otherwise prefer Libro1.csv if available
    if (typeof libroCsvRaw === 'string' && libroCsvRaw.trim().length > 0) {
      const parsed = parseCSV(libroCsvRaw);
      return parsed;
    }

    const raw = libroRaw ? libroRaw.replace(/\r\u0000/g, '\r').replace(/\n\u0000/g, '\n') : '';
    // dividir en líneas y limpiar
    const lines = raw.split(/\r?\n/).map(l => sanitize(l)).filter(Boolean);
    // Buscar la línea de encabezado y empezar después
    let start = 0;
    if (lines[0] && /NUMERO\s+DE\s+PARTE/i.test(lines[0])) start = 1;

    for (let i = start; i < lines.length; i++) {
      // Normalizar tabs múltiples y separar
      const parts = lines[i].split(/\t+/).map(s => sanitize(s));
      if (parts.length < 4) {
        // intentar separar por múltiples espacios como fallback
        const alt = lines[i].split(/\s{2,}/).map(s => sanitize(s));
        if (alt.length >= 4) parts.splice(0, parts.length, ...alt);
      }
      if (parts.length < 4) continue;

      const numero = parts[0] || "";
      const proyecto = parts[1] || "";
      const responsable = parts[parts.length - 1] || "";
      const precioRaw = parts[parts.length - 2] || "";
      const descripcion = parts.slice(2, parts.length - 2).join(' ') || "";

      const parsedPrice = (() => {
        if (!precioRaw) return null;
        const cleaned = precioRaw.replace(/[^0-9,.-]/g, '').replace(/,/g, '.');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : null;
      })();

      rows.push({ numero, proyecto, descripcion: descripcion.replace(/^\"|\"$/g, ''), precio: parsedPrice, responsable });
    }
  } catch (e) {
    console.error('Error parsing LibroK1.txt', e);
  }
  // si no se obtuvieron filas válidas, devolver datos mock para mantener la UI poblada
  return rows.length > 0 ? rows : MOCK_PARTS;
})();

function InventoryTable({ items, onRowClick }){
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  React.useEffect(()=>{ if (page >= totalPages) setPage(totalPages - 1); }, [pageSize, totalPages]);

  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div>
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-auto max-h-[56vh]">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold">NÚMERO DE PARTE</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">PROYECTO</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">DESCRIPCIÓN</th>
                <th className="text-right px-4 py-3 text-sm font-semibold">PRECIO</th>
                <th className="text-left px-4 py-3 text-sm font-semibold">RESPONSABLE</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No hay registros</td>
                </tr>
              ) : (
                pageItems.map((p,i)=> (
                  <tr key={start + i} onClick={()=> onRowClick && onRowClick(p)} className={(start + i)%2===0? 'bg-white hover:bg-slate-50 cursor-pointer' : 'bg-slate-50 hover:bg-slate-100 cursor-pointer'}>
                    <td className="px-4 py-3 font-semibold text-sm">{p.numero}</td>
                    <td className="px-4 py-3 text-sm">{p.proyecto}</td>
                    <td className="px-4 py-3 text-sm">{p.descripcion}</td>
                    <td className="px-4 py-3 text-sm text-right">{p.precio==null? '—' : `$${p.precio.toFixed(2)}`}</td>
                    <td className="px-4 py-3 text-sm">{p.responsable}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 text-sm">
          <div className="text-slate-600">Mostrando {total === 0 ? 0 : Math.min(total, start+1)} - {Math.min(total, start + pageSize)} de {total} registros</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Filas:</label>
              <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(0); }} className="rounded-md border px-2 py-1">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={()=>setPage(p=> Math.max(0, p-1))} disabled={page===0}>Anterior</Button>
              <div className="px-2">{page+1} / {totalPages}</div>
              <Button size="sm" onClick={()=>setPage(p=> Math.min(totalPages-1, p+1))} disabled={page>=totalPages-1}>Siguiente</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InventoryCarousel({ items, onViewDetails }){
  const len = (items && items.length) || 0;
  const [idx,setIdx] = React.useState(0)

  React.useEffect(()=>{
    if (idx >= len) setIdx(Math.max(0, len - 1));
  }, [len]);

  const next = ()=> { if (len === 0) return; setIdx(i=> (i+1)%len) }
  const prev = ()=> { if (len === 0) return; setIdx(i=> (i-1+len)%len) }

  if (len === 0) {
    return <div className="p-4 rounded-lg bg-white text-sm text-slate-500">No hay piezas para mostrar</div>;
  }

  const p = items[idx]
  return (
    <div>
      <div className="flex gap-4 items-start">
        <div className="flex-1 rounded-lg bg-white p-4">
          <div className="text-xs text-slate-500">Número de parte</div>
          <div className="font-semibold text-lg">{p.numero}</div>
          <div className="mt-2 text-sm text-slate-700">{p.descripcion}</div>
          <div className="mt-4 font-semibold">{p.precio==null? '—' : `$${p.precio.toFixed(2)}`}</div>
          <div className="text-xs text-slate-500 mt-1">Responsable: {p.responsable}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" onClick={next}>Siguiente ›</Button>
          <Button size="sm" onClick={prev}>‹ Anterior</Button>
          <Button size="sm" onClick={()=> onViewDetails && onViewDetails(p)}>Ver detalles</Button>
        </div>
      </div>
      <div className="text-xs text-slate-500 mt-2">{idx+1} / {items.length}</div>
    </div>
  )
}

function InventorySection({ parts = PARTS }){
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPart, setSelectedPart] = React.useState(null);
  const [mode,setMode] = React.useState('table')
  const [query, setQuery] = React.useState('')
  const [projectFilter, setProjectFilter] = React.useState('')
  const [responsibleFilter, setResponsibleFilter] = React.useState('')

  // calcular totales sobre el conjunto filtrado
  const filtered = React.useMemo(()=>{
    const q = query.trim().toLowerCase();
    return (parts || []).filter(p=>{
      if (projectFilter && (p.proyecto||'').toLowerCase() !== projectFilter.toLowerCase()) return false;
      if (responsibleFilter && (p.responsable||'').toLowerCase() !== responsibleFilter.toLowerCase()) return false;
      if (!q) return true;
      return [p.numero, p.descripcion, p.proyecto, p.responsable].some(f=> (f||'').toString().toLowerCase().includes(q));
    })
  }, [query, projectFilter, responsibleFilter, parts]);

  const total = filtered.reduce((a,p)=> a + (p.precio||0),0)

  // valores únicos para selects
  const projects = Array.from(new Set((parts||[]).map(p=>p.proyecto))).filter(Boolean);
  const responsables = Array.from(new Set((parts||[]).map(p=>p.responsable))).filter(Boolean);

  // KPIs derivados
  const totalItems = filtered.length;
  const totalValue = filtered.reduce((s,p)=> s + (p.precio || 0), 0);
  const avgPrice = totalItems ? (totalValue / totalItems) : 0;

  // top projects by total value
  const projectAgg = {};
  for (const p of filtered) {
    const key = p.proyecto || 'Sin proyecto';
    if (!projectAgg[key]) projectAgg[key] = { name: key, value: 0, count: 0 };
    projectAgg[key].value += (p.precio || 0);
    projectAgg[key].count += 1;
  }
  const topProjects = Object.values(projectAgg).sort((a,b)=> b.value - a.value).slice(0,6);

  const openDetails = (part) => { setSelectedPart(part); setModalOpen(true); }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Input placeholder="Buscar número, descripción o proyecto" value={query} onChange={(e)=>setQuery(e.target.value)} className="rounded-xl" />
          <Select value={projectFilter} onChange={(e)=>setProjectFilter(e.target.value)}>
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Proyecto" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {projects.map((pr)=> <SelectItem key={pr} value={pr}>{pr}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={responsibleFilter} onChange={(e)=>setResponsibleFilter(e.target.value)}>
            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Responsable" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {responsables.map((r)=> <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-500">{filtered.length} items • Total USD {total.toFixed(2)}</div>
          <div className="flex gap-2">
            <Button size="sm" onClick={()=>setMode('table')} className={mode==='table'? 'bg-primary-500 text-white' : 'border'}>Tabla</Button>
            <Button size="sm" onClick={()=>setMode('carousel')} className={mode==='carousel'? 'bg-primary-500 text-white' : 'border'}>Slide</Button>
          </div>
        </div>
      </div>
      {/* Primary: Table or Carousel */}
      {mode==='table' ? (
        <>
          <InventoryTable items={filtered} onRowClick={openDetails}/>

          {/* Secondary: KPIs + Chart (below the table to prioritize table) - dark style */}
          <div className="mt-4">
            <div className="rounded-lg bg-slate-900 text-slate-100 p-3 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg bg-slate-800 p-4">
                  <div className="text-xs text-slate-400">Total piezas</div>
                  <div className="text-2xl font-semibold">{totalItems}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <div className="text-xs text-slate-400">Valor total (USD)</div>
                  <div className="text-2xl font-semibold">${totalValue.toFixed(2)}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <div className="text-xs text-slate-400">Precio promedio</div>
                  <div className="text-2xl font-semibold">${avgPrice.toFixed(2)}</div>
                </div>
                <div className="rounded-lg bg-slate-800 p-4">
                  <div className="text-xs text-slate-400">Proyectos</div>
                  <div className="text-2xl font-semibold">{projects.length}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <InventoryCarousel items={filtered} onViewDetails={openDetails}/>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-xs text-slate-500">Total piezas</div>
              <div className="text-2xl font-semibold">{totalItems}</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-xs text-slate-500">Valor total (USD)</div>
              <div className="text-2xl font-semibold">${totalValue.toFixed(2)}</div>
            </div>
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={()=> setModalOpen(false)} title={selectedPart ? `Detalle — ${selectedPart.numero}` : 'Detalle'}>
        {selectedPart ? (
          <div className="space-y-2">
            <div><strong>Proyecto:</strong> {selectedPart.proyecto}</div>
            <div><strong>Descripción:</strong> {selectedPart.descripcion}</div>
            <div><strong>Precio:</strong> {selectedPart.precio==null? '—' : `$${selectedPart.precio.toFixed(2)}`}</div>
            <div><strong>Responsable:</strong> {selectedPart.responsable}</div>
          </div>
        ) : <div>No hay detalle</div>}
      </Modal>
    </div>
  )
}

function KpiCard({ title, meta, value }) {
  const cumplido = value >= meta;
  return (
    <Card className="rounded-2xl shadow-sm border-l-4 border-accent-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold">{value}%</div>
        <div className="space-y-1 text-right">
          <Badge variant={cumplido ? "default" : "secondary"} className="rounded-full bg-accent-300 text-white">
            Meta {meta}%
          </Badge>
          <div className={"text-xs " + (cumplido ? "text-emerald-600" : "text-amber-600")}>
            {cumplido ? "Cumplido" : "En seguimiento"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [area, setArea] = React.useState("");
  const [proy, setProy] = React.useState("");
  const [route, setRoute] = React.useState(() => location.hash || '#/')

  // Inventory summary for dashboard
  const INV_TOTAL = PARTS.length;
  const INV_VALUE = PARTS.reduce((s,p)=> s + (p.precio||0), 0);
  const INV_AVG = INV_TOTAL ? (INV_VALUE/INV_TOTAL) : 0;
  const INV_PROJECTS = Array.from(new Set(PARTS.map(p=>p.proyecto))).filter(Boolean).length;
  const invAgg = {};
  for (const p of PARTS){
    const key = p.proyecto || 'Sin proyecto';
    if (!invAgg[key]) invAgg[key] = { name: key, value: 0 };
    invAgg[key].value += (p.precio||0);
  }
  const INV_TOP = Object.values(invAgg).sort((a,b)=> b.value - a.value).slice(0,6);

  React.useEffect(()=>{
    const onHash = ()=> setRoute(location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
  {/* Header */}
  <header className="sticky top-0 z-40 bg-gradient-to-r from-accent-300 via-primary-100 to-primary-50 backdrop-blur border-b border-primary-100">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://www.directorioautomotriz.com.mx/media/company/logo/2423/e1da90b1617d502a77aaa67631fd7870.jpg" alt="Logo" className="h-9 w-9 rounded-2xl object-cover" />
            <div>
              <h1 className="font-semibold leading-tight">Plataforma Digital — Diseño previo</h1>
              <p className="text-xs text-slate-500">Dashboard • Reportes • Trazabilidad • Seguridad</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full"><Bell className="h-5 w-5" /></Button>
            <Button size="sm" className="rounded-full bg-primary-500 text-white hover:bg-primary-700">Exportar <Download className="ml-2 h-4 w-4"/></Button>
          </div>
        </div>
      </header>

  <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
          <nav className="space-y-2">
            <Button
              variant="secondary"
              className={"w-full justify-start rounded-2xl " + (route === '#/' ? 'bg-primary-50 text-primary-700' : '')}
              onClick={()=> { location.hash = '#/'; }}
            ><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Button>

            <Button
              variant="ghost"
              className={"w-full justify-start rounded-2xl " + (route === '#/inventario' ? 'bg-primary-50 text-primary-700' : '')}
              onClick={()=> { location.hash = '#/inventario'; }}
            ><FileBarChart2 className="mr-2 h-4 w-4"/>Inventario</Button>

            <Button variant="ghost" className="w-full justify-start rounded-2xl"><BarChart3 className="mr-2 h-4 w-4"/>Reportes</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><FileBarChart2 className="mr-2 h-4 w-4"/>Trazabilidad</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><ShieldCheck className="mr-2 h-4 w-4"/>Seguridad</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><Settings className="mr-2 h-4 w-4"/>Configuración</Button>
          </nav>

          

          <Separator className="my-6" />

          <Card className="rounded-2xl border border-primary-50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Checklist de preparación</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                "KPIs definidos y documentados",
                "Conectores SAP/Excel operando",
                "Reglas de calidad aplicadas",
                "Modelo de datos (estrella)",
                "Dashboards con filtros",
                "RLS y bitácoras activas",
                "Reportes automáticos",
              ].map((txt, idx) => (
                <div key={idx} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600"/><span>{txt}</span></div>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
  <main className="flex-1 overflow-auto col-span-12 lg:col-span-9 xl:col-span-10 space-y-6 min-h-0">
          {route === '#/inventario' ? (
            <InventarioPage />
          ) : (
          <>
            {/* Filtros */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-base">Filtros</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Select value={area} onChange={(e)=>setArea(e.target.value)}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Área" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finanzas">Finanzas</SelectItem>
                    <SelectItem value="produccion">Producción</SelectItem>
                    <SelectItem value="calidad">Calidad</SelectItem>
                    <SelectItem value="ingenieria">Ingeniería</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={proy} onChange={(e)=>setProy(e.target.value)}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Proyecto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plataforma">Plataforma</SelectItem>
                    <SelectItem value="integracion">Integración</SelectItem>
                    <SelectItem value="kpis">KPIs</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" className="rounded-xl"/>
                <Button className="rounded-xl"><Filter className="mr-2 h-4 w-4"/>Aplicar</Button>
              </CardContent>
            </Card>

            {/* KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <KpiCard title="Reducción de errores" meta={kpiMeta.errores} value={kpiResultado.errores} />
              <KpiCard title="Reducción de tiempos" meta={kpiMeta.tiempos} value={kpiResultado.tiempos} />
              <KpiCard title="Trazabilidad" meta={kpiMeta.trazabilidad} value={kpiResultado.trazabilidad} />
              <KpiCard title="Reducción de duplicidad" meta={kpiMeta.duplicidad} value={kpiResultado.duplicidad} />
              <KpiCard title="Adopción de usuarios" meta={kpiMeta.adopcion} value={kpiResultado.adopcion} />
              <KpiCard title="Ejecución del plan" meta={kpiMeta.ejecucion} value={kpiResultado.ejecucion} />
            </div>

            {/* Inventory overview */}
            <div className="mt-4">
              <div className="rounded-2xl bg-slate-900 text-slate-100 p-3 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-semibold">Inventario — Resumen</h3>
                      <div className="text-xs text-slate-400">Resumen rápido del inventario</div>
                    </div>
                    <div>
                      <button onClick={()=> location.hash = '#/inventario'} className="rounded-md bg-primary-500 text-white px-2 py-1 text-sm">Ir a Inventario</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
                    <div className="bg-slate-800 p-2 rounded-md">
                      <div className="text-[11px] text-slate-400">Total piezas</div>
                      <div className="text-xl font-semibold">{INV_TOTAL}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-md">
                      <div className="text-[11px] text-slate-400">Valor total (USD)</div>
                      <div className="text-xl font-semibold">${INV_VALUE.toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-md">
                      <div className="text-[11px] text-slate-400">Precio promedio</div>
                      <div className="text-xl font-semibold">${INV_AVG.toFixed(2)}</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-md">
                      <div className="text-[11px] text-slate-400">Proyectos</div>
                      <div className="text-xl font-semibold">{INV_PROJECTS}</div>
                    </div>
                  </div>

                  <div className="h-28 rounded-md bg-slate-800 p-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={INV_TOP} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0b1220" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(val)=> `$${Number(val).toFixed(2)}`} />
                        <Bar dataKey="value" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            </div>

            {/* Main charts: two-up layout */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-base">Trazabilidad y adopción — 2025</CardTitle></CardHeader>
                <CardContent className="h-48 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ fontSize: 12 }} />
                      {/* legend removed to save vertical space */}
                      <Line type="monotone" dataKey="trazabilidad" stroke="#0ea5e9" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="adopcion" stroke="#10b981" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-base">Meta vs Resultado (KPIs)</CardTitle></CardHeader>
                <CardContent className="h-48 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metaVsResultado} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="kpi" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 110]} tick={{ fontSize: 12 }} />
                      <Tooltip wrapperStyle={{ fontSize: 12 }} />
                      {/* legend removed to save vertical space */}
                      <Bar dataKey="meta" fill="#94a3b8" />
                      <Bar dataKey="resultado" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Eventos */}
            <Card className="rounded-2xl mt-4">
              <CardHeader className="pb-2"><CardTitle className="text-base">Últimos eventos de trazabilidad</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 text-xs font-medium text-slate-500">
                  <div className="col-span-3">Fecha</div>
                  <div className="col-span-3">Área</div>
                  <div className="col-span-3">Usuario</div>
                  <div className="col-span-3">Acción</div>
                </div>
                <Separator className="my-2" />
                <div className="space-y-2">
                  {eventos.map((e, i) => (
                    <div key={i} className="grid grid-cols-12 items-center rounded-xl bg-white p-3 shadow-sm">
                      <div className="col-span-3 text-sm">{e.fecha}</div>
                      <div className="col-span-3 text-sm">{e.area}</div>
                      <div className="col-span-3 text-sm">{e.usuario}</div>
                      <div className="col-span-3 text-sm">{e.accion}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-center text-slate-500">
        Diseño previo basado en requerimientos: centralización, estandarización, reportes automáticos, trazabilidad y seguridad.
      </footer>
    </div>
  );
}

// Export for tests
export { InventorySection };
