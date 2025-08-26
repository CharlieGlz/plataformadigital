import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BarChart3, FileBarChart2, ShieldCheck, Settings, Filter, Download, Bell, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import libroRaw from "../LibroK1.txt?raw";

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

// Cargar inventario desde LibroK1.txt incluido en el repo (se parsea en tiempo de build)
const PARTS = (() => {
  const rows = [];
  try {
    if (!libroRaw) return [];
    const lines = libroRaw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    // Buscar la línea de encabezado y empezar después
    let start = 0;
    if (lines[0] && /NUMERO\s+DE\s+PARTE/i.test(lines[0])) start = 1;
    for (let i = start; i < lines.length; i++) {
      const cols = lines[i].split(/\t+/).map(c => c.trim());
      if (cols.length < 4) continue;
      // Algunas líneas pueden tener el precio separado por espacios; tomar las últimas columnas
      const numero = cols[0] || "";
      const proyecto = cols[1] || "";
      const responsable = cols[cols.length - 1] || "";
      const precioRaw = cols[cols.length - 2] || "";
      const descripcion = cols.slice(2, cols.length - 2).join(" ") || "";
      const parsedPrice = (() => {
        if (!precioRaw) return null;
        const cleaned = precioRaw.replace(/[^0-9,.-]/g, '').replace(/,/g, '.');
        const n = parseFloat(cleaned);
        return Number.isFinite(n) ? n : null;
      })();
      rows.push({ numero, proyecto, descripcion: descripcion.replace(/^"|"$/g, ''), precio: parsedPrice, responsable });
    }
  } catch (e) {
    // en caso de error, fallback a array vacío
    console.error('Error parsing LibroK1.txt', e);
  }
  return rows;
})();

function InventoryTable({ items }){
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  React.useEffect(()=>{ if (page >= totalPages) setPage(totalPages - 1); }, [pageSize, totalPages]);

  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div>
      <div className="overflow-auto rounded-lg border">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold">NÚMERO DE PARTE</th>
              <th className="text-left px-4 py-3 text-sm font-semibold">PROYECTO</th>
              <th className="text-left px-4 py-3 text-sm font-semibold">DESCRIPCIÓN</th>
              <th className="text-right px-4 py-3 text-sm font-semibold">PRECIO</th>
              <th className="text-left px-4 py-3 text-sm font-semibold">RESPONSABLE</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p,i)=> (
              <tr key={start + i} className={(start + i)%2===0? 'bg-white' : 'bg-slate-50'}>
                <td className="px-4 py-3 font-semibold text-sm">{p.numero}</td>
                <td className="px-4 py-3 text-sm">{p.proyecto}</td>
                <td className="px-4 py-3 text-sm">{p.descripcion}</td>
                <td className="px-4 py-3 text-sm text-right">{p.precio==null? '—' : `$${p.precio.toFixed(2)}`}</td>
                <td className="px-4 py-3 text-sm">{p.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="text-slate-600">Mostrando {Math.min(total, start+1)} - {Math.min(total, start + pageSize)} de {total} registros</div>
        <div className="flex items-center gap-2">
          <div>
            <label className="text-xs text-slate-500 mr-2">Filas:</label>
            <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(0); }} className="rounded-md border px-2 py-1">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={()=>setPage(p=> Math.max(0, p-1))} disabled={page===0}>Anterior</Button>
            <div className="px-3">{page+1} / {totalPages}</div>
            <Button size="sm" onClick={()=>setPage(p=> Math.min(totalPages-1, p+1))} disabled={page>=totalPages-1}>Siguiente</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InventoryCarousel({ items }){
  const [idx,setIdx] = React.useState(0)
  const next = ()=> setIdx(i=> (i+1)%items.length)
  const prev = ()=> setIdx(i=> (i-1+items.length)%items.length)
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
        </div>
      </div>
      <div className="text-xs text-slate-500 mt-2">{idx+1} / {items.length}</div>
    </div>
  )
}

function InventorySection(){
  const [mode,setMode] = React.useState('table')
  const [query, setQuery] = React.useState('')
  const [projectFilter, setProjectFilter] = React.useState('')
  const [responsibleFilter, setResponsibleFilter] = React.useState('')

  // calcular totales sobre el conjunto filtrado
  const filtered = React.useMemo(()=>{
    const q = query.trim().toLowerCase();
    return PARTS.filter(p=>{
      if (projectFilter && p.proyecto.toLowerCase() !== projectFilter.toLowerCase()) return false;
      if (responsibleFilter && p.responsable.toLowerCase() !== responsibleFilter.toLowerCase()) return false;
      if (!q) return true;
      return [p.numero, p.descripcion, p.proyecto, p.responsable].some(f=> (f||'').toString().toLowerCase().includes(q));
    })
  }, [query, projectFilter, responsibleFilter]);

  const total = filtered.reduce((a,p)=> a + (p.precio||0),0)

  // valores únicos para selects
  const projects = Array.from(new Set(PARTS.map(p=>p.proyecto))).filter(Boolean);
  const responsables = Array.from(new Set(PARTS.map(p=>p.responsable))).filter(Boolean);

  return (
    <div>
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
            <Button size="sm" onClick={()=>setMode('table')} className={mode==='table'? 'bg-brand-700 text-white' : 'border'}>Tabla</Button>
            <Button size="sm" onClick={()=>setMode('carousel')} className={mode==='carousel'? 'bg-brand-700 text-white' : 'border'}>Slide</Button>
          </div>
        </div>
      </div>
      {mode==='table' ? <InventoryTable items={filtered}/> : <InventoryCarousel items={filtered}/>}      
    </div>
  )
}

function KpiCard({ title, meta, value }) {
  const cumplido = value >= meta;
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold">{value}%</div>
        <div className="space-y-1 text-right">
          <Badge variant={cumplido ? "default" : "secondary"} className="rounded-full">
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

  return (
    <div className="min-h-screen bg-slate-50">
  {/* Header */}
  <header className="sticky top-0 z-40 bg-brand-50 backdrop-blur border-b">
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
            <Button size="sm" className="rounded-full bg-brand-600 text-white">Exportar <Download className="ml-2 h-4 w-4"/></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2">
          <nav className="space-y-2">
            <Button variant="secondary" className="w-full justify-start rounded-2xl bg-brand-50 text-brand-700"><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><BarChart3 className="mr-2 h-4 w-4"/>Reportes</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><FileBarChart2 className="mr-2 h-4 w-4"/>Trazabilidad</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><ShieldCheck className="mr-2 h-4 w-4"/>Seguridad</Button>
            <Button variant="ghost" className="w-full justify-start rounded-2xl"><Settings className="mr-2 h-4 w-4"/>Configuración</Button>
          </nav>

          <Separator className="my-6" />

          <Card className="rounded-2xl">
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
        <main className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-6">
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

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard title="Reducción de errores" meta={kpiMeta.errores} value={kpiResultado.errores} />
            <KpiCard title="Reducción de tiempos" meta={kpiMeta.tiempos} value={kpiResultado.tiempos} />
            <KpiCard title="Trazabilidad" meta={kpiMeta.trazabilidad} value={kpiResultado.trazabilidad} />
            <KpiCard title="Reducción de duplicidad" meta={kpiMeta.duplicidad} value={kpiResultado.duplicidad} />
            <KpiCard title="Adopción de usuarios" meta={kpiMeta.adopcion} value={kpiResultado.adopcion} />
            <KpiCard title="Ejecución del plan" meta={kpiMeta.ejecucion} value={kpiResultado.ejecucion} />
          </div>

          {/* Charts */}
          <Tabs defaultValue="tendencias" className="mt-2">
            <TabsList className="rounded-2xl bg-brand-50 border border-brand-100">
              <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
              <TabsTrigger value="meta">Meta vs Resultado</TabsTrigger>
              <TabsTrigger value="eventos">Eventos</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              
            </TabsList>
            <TabsContent value="tendencias" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-base">Trazabilidad y adopción — 2025</CardTitle></CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="trazabilidad" stroke="#0ea5e9" strokeWidth={2} />
                      <Line type="monotone" dataKey="adopcion" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="meta" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-base">Meta vs Resultado (KPIs)</CardTitle></CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metaVsResultado}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="kpi" />
                      <YAxis domain={[0, 110]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="meta" fill="#94a3b8" />
                      <Bar dataKey="resultado" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="eventos" className="mt-4">
              <Card className="rounded-2xl">
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
            </TabsContent>
            <TabsContent value="inventario" className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-base">Inventario de piezas — MOBIS</CardTitle></CardHeader>
                <CardContent>
                  <InventorySection />
                </CardContent>
              </Card>
            </TabsContent>
            
          </Tabs>
        </main>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-center text-slate-500">
        Diseño previo basado en requerimientos: centralización, estandarización, reportes automáticos, trazabilidad y seguridad.
      </footer>
    </div>
  );
}
