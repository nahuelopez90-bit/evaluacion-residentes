"use client";

import { useMemo, useState } from "react";

type Score = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SubItem = {
  key: string;
  title: string;
  description: string;
};

type Competency = {
  id: string;
  title: string;
  items: SubItem[];
};

// Competencias exactas según tu Word
const COMPETENCIES: Competency[] = [
  {
    id: "1",
    title: "PROFESIONALISMO",
    items: [
      {
        key: "1.a",
        title: "Integridad. Ética. Responsabilidad.",
        description:
          "Asume responsabilidades de buen grado. Admite errores. Pone las necesidades del paciente por encima de sus intereses. Reconoce y maneja dilemas éticos y conflictos de interés. Respeta la confidencialidad del paciente. Es trabajador/a y confiable. Completa sus tareas cuidadosa y minuciosamente. Responde a pedidos en forma útil y rápida.",
      },
      {
        key: "1.b",
        title: "Prácticas según sus capacidades.",
        description:
          "Reconoce los límites de sus capacidades. Pide ayuda cuando es necesario. Deriva o refiere pacientes cuando es adecuado. Ejerce la autoridad de acuerdo a su posición y/o experiencia.",
      },
      {
        key: "1.c",
        title: "Preocupación por los pacientes según sus necesidades y características.",
        description:
          "Responde apropiadamente a la emociones del paciente/familiares. Establece buena relación. Brinda tranquilidad. Es respetuoso/a, considerado/a y paciente. Es sensible a aspectos relacionados con la edad, cultura, género, identidad/orientación sexual, etnia y discapacidades de los pacientes. Provee cuidados equitativos a todos los pacientes.",
      },
    ],
  },
  {
    id: "2",
    title: "HABILIDADES COMUNICACIONALES",
    items: [
      {
        key: "2.a",
        title: "Comunicación con pacientes/familias.",
        description:
          "Deja hablar al paciente. Escucha con atención. Usa lenguaje no técnico al explicar o recomendar. Involucra al paciente en la toma de decisiones. Fomenta preguntas y comprobaciones para la comprensión. Demuestra habilidades para aconsejar al paciente y obtener el consentimiento informado.",
      },
      {
        key: "2.b",
        title: "Comunicación con otros profesionales de la salud.",
        description:
          "Escribe historias clínicas completas, claras y concisas. Escribe notas de derivación adecuadas. Presenta al paciente de manera concisa y organizada.",
      },
      {
        key: "2.c",
        title: "Trabajo con otros miembros del equipo de salud.",
        description:
          "Demuestra cortesía y consideración con los otros miembros del equipo de salud. Invita a otros a compartir sus conocimientos y opiniones. Hace peticiones sin exigir. Negocia y acuerda cuando hay desacuerdos. Maneja conflictos constructivamente.",
      },
    ],
  },
  {
    id: "3",
    title: "CONOCIMIENTO MÉDICO",
    items: [
      {
        key: "3.a",
        title: "Conocimientos básicos y clínicos actualizados.",
        description:
          "Identifica y discute la fisiopatología, diagnóstico, evaluación y tratamiento de las enfermedades. Comprende la racionalidad de distintas aproximaciones a los problemas médicos. Busca nueva información mediante preguntas adecuadas y revisión bibliográfica. Cita literatura reciente cuando es adecuado.",
      },
      {
        key: "3.b",
        title: "Pensamiento crítico para analizar problemas de salud.",
        description:
          "Usa técnicas efectivas para resolución de problemas. Demuestra juicio clínico. Tiene una aproximación analítica a las situaciones clínicas.",
      },
    ],
  },
  {
    id: "4",
    title: "APRENDIZAJE Y MEJORAMIENTO BASADO EN LA PRÁCTICA",
    items: [
      {
        key: "4.a",
        title: "Mejoría de calidad e integración con la práctica clínica.",
        description:
          "Compara su propio desempeño con guías aceptadas y datos nacionales. Reflexiona sobre incidentes críticos para identificar fortalezas y debilidades. Monitorea los efectos de cambios y mejoras en la práctica.",
      },
      {
        key: "4.b",
        title: "Evaluación crítica de la literatura y aplicación a la práctica clínica.",
        description:
          "Puede identificar y mejorar debilidades en sus conocimientos. Busca feedback. Busca y revisa bibliografía cuando es necesario. Evalúa críticamente la evidencia y la aplica al cuidado del paciente. Usa recursos de tecnología de la información (TI) para mejorar su aprendizaje.",
      },
      {
        key: "4.c",
        title: "Actividades de mejora.",
        description:
          "Cambia sus patrones de práctica clínica en respuesta al feedback. Aplica nuevas herramientas y conocimientos al cuidado del paciente. Adapta la evidencia al cuidado de cada paciente. Usa TI para mejorar el cuidado del paciente.",
      },
      {
        key: "4.d",
        title: "Facilitación del aprendizaje de sus colegas.",
        description:
          "Puede explicar el razonamiento clínico y procedimientos a sus colegas. Aporta información clínicamente útil en respuesta a preguntas de aprendizaje. Aporta recursos útiles de aprendizaje.",
      },
    ],
  },
  {
    id: "5",
    title: "CUIDADO DEL PACIENTE",
    items: [
      {
        key: "5.a",
        title: "Evaluación y manejo integral del paciente.",
        description:
          "Obtiene historias clínicas completas y precisas. Realiza examen físico apropiado y exhaustivo. Ordena estudios de laboratorio e imágenes adecuados. Integra la información en forma coherente y lógica. Plantea adecuados diagnósticos diferenciales.",
      },
      {
        key: "5.b",
        title: "Manejo de problemas y seguimiento de los pacientes.",
        description:
          "Desarrolla planes adecuados para la evaluación y tratamiento de los pacientes. Se anticipa a sus necesidades. Identifica y maneja problemas clínicos. Redacta el plan en forma clara y lógica. Agenda visitas de seguimiento en tiempo adecuado.",
      },
      {
        key: "5.c",
        title: "Establecimiento del diagnóstico y decisiones terapéuticas.",
        description:
          "Sintetiza la información para llegar a un diagnóstico y tomar decisiones terapéuticas. Utiliza adecuadamente las consultas a subespecialidades. Trabaja en conjunto con los consultores para asegurar intervenciones diagnósticas y terapéuticas a tiempo.",
      },
      {
        key: "5.d",
        title: "Respuesta a situaciones de urgencia.",
        description:
          "Responde rápidamente a cambios en las situaciones clínicas. Inicia intervenciones de urgencia adecuadas. Realiza las consultas adecuadas para asegurar la mejoría clínica.",
      },
      {
        key: "5.e",
        title: "Realización de procedimientos según su nivel de entrenamiento.",
        description:
          "Demuestra técnica manual y destreza al realizar procedimientos. Muestra competencia en los aspectos técnicos del procedimiento. Conoce las indicaciones, contraindicaciones y complicaciones de los procedimientos que realiza.",
      },
    ],
  },
  {
    id: "6",
    title: "PRÁCTICA DENTRO DEL SISTEMA DE SALUD",
    items: [
      {
        key: "6.a",
        title: "Cuidado médico costo-efectivo.",
        description:
          "Considera el costo-beneficio de los estudios y tratamientos que indica. Adhiere a protocolos y guías para el cuidado del paciente. No indica tests innecesarios.",
      },
      {
        key: "6.b",
        title: "Promoción de la seguridad del paciente.",
        description:
          "Identifica causas de error médico. Se anticipa y responde a problemas en el cuidado del paciente. Adhiere a protocolos que promueven la seguridad del paciente. Acepta aportes del equipo de cuidado del paciente.",
      },
      {
        key: "6.c",
        title: "Cuidado coordinado junto con otros profesionales de la salud.",
        description:
          "Se comunica con interconsultores cuando es necesario. Resuelve diferencias en el plan de tratamiento. Llega a acuerdos cuando las recomendaciones se contradicen. Se asegura que el paciente conozca las diferentes opciones de tratamiento disponibles. Hace derivaciones adecuadas a otros profesionales de la salud. Ayuda a agendar estas citas y se asegura el seguimiento para el cuidado adecuado.",
      },
    ],
  },
];

function ScoreGroup({
  value,
  onChange,
}: {
  value: Score | null;
  onChange: (v: Score) => void;
}) {
  const options: Score[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 1fr)",
        gap: 8,
        marginTop: 10,
      }}
    >
      {options.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              borderRadius: 12,
              padding: "10px 0",
              border: `1px solid ${active ? "#2563eb" : "#d1d5db"}`,
              background: active ? "rgba(37,99,235,0.10)" : "white",
              cursor: "pointer",
              fontWeight: 800,
              color: active ? "#1d4ed8" : "#111827",
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function Badge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${
          ok ? "rgba(22,163,74,0.35)" : "rgba(220,38,38,0.35)"
        }`,
        background: ok ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)",
        color: ok ? "#166534" : "#991b1b",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 99,
          background: ok ? "#16a34a" : "#dc2626",
          display: "inline-block",
        }}
      />
      {text}
    </span>
  );
}

function SubCompetencyCard({
  code,
  title,
  description,
  value,
  onChange,
  comment,
  onComment,
}: {
  code: string;
  title: string;
  description: string;
  value: Score | null;
  onChange: (v: Score) => void;
  comment: string;
  onComment: (t: string) => void;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 10px 18px rgba(0,0,0,0.06)",
        padding: 18,
        marginTop: 12,
        border: "1px solid rgba(209,213,219,0.7)",
      }}
    >
      <div
        style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}
      >
        <div
          style={{
            fontWeight: 900,
            color: "#1d4ed8",
            background: "rgba(37,99,235,0.10)",
            border: "1px solid rgba(37,99,235,0.25)",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 13,
          }}
        >
          {code}
        </div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>

      <p style={{ margin: "6px 0 0 0" }}>{description}</p>

      <ScoreGroup value={value} onChange={onChange} />

      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Comentario</label>
        <textarea
          className="input"
          value={comment}
          onChange={(e) => onComment(e.target.value)}
          placeholder="Observaciones (conductas observables, ejemplos breves, recomendaciones)"
          style={{ minHeight: 86, resize: "vertical" }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [resident, setResident] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [origin, setOrigin] = useState("");
  const [resYear, setResYear] = useState("");
  const [date, setDate] = useState("");

  const allSubKeys = useMemo(
    () => COMPETENCIES.flatMap((c) => c.items.map((i) => i.key)),
    []
  );

  const [scores, setScores] = useState<Record<string, Score | null>>(() => {
    const init: Record<string, Score | null> = {};
    allSubKeys.forEach((k) => (init[k] = null));
    return init;
  });

  const [comments, setComments] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    allSubKeys.forEach((k) => (init[k] = ""));
    return init;
  });

  const computed = useMemo(() => {
    const values = Object.values(scores).filter((v): v is Score => v !== null);
    const total = values.reduce((acc, n) => acc + n, 0);
    const avg = values.length ? total / values.length : 0;
    const missingCount = Object.values(scores).filter((v) => v === null).length;

    return {
      total,
      avg,
      missingCount,
      filledCount: values.length,
      totalItems: allSubKeys.length,
    };
  }, [scores, allSubKeys.length]);

  const generalOk =
    resident.trim().length > 0 &&
    evaluator.trim().length > 0 &&
    origin.trim().length > 0 &&
    resYear.trim().length > 0 &&
    date.trim().length > 0;

  const competenciesOk = computed.missingCount === 0;
  const canExport = generalOk && competenciesOk;

  function setScore(key: string, v: Score) {
    setScores((prev) => ({ ...prev, [key]: v }));
  }

  function setComment(key: string, t: string) {
    setComments((prev) => ({ ...prev, [key]: t }));
  }

  async function handleSaveSheets() {
    if (!canExport) return;

    const payload = {
      resident,
      evaluator,
      origin,
      resYear,
      date,
      total: computed.total,
      avg: computed.avg,
      scores,
      comments,
    };

    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      alert("Error al guardar: " + (data?.error || res.statusText));
      return;
    }

    alert("Guardado OK en Google Sheets ✅");
  }

  async function handlePDF() {
    if (!canExport) return;

    const payload = {
      resident,
      evaluator,
      origin,
      resYear,
      date,
      total: computed.total,
      avg: computed.avg,
      scores,
      comments,
      competencies: COMPETENCIES,
    };

    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert("Error PDF: " + (data?.error || res.statusText));
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluacion-residente.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 16px" }}>
      <h1>Evaluación de Competencias — Residentes</h1>

      <div className="card">
        <h2>Datos generales</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Residente</label>
            <input
              className="input"
              value={resident}
              onChange={(e) => setResident(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Evaluador</label>
            <input
              className="input"
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>
              Residencia de origen
            </label>
            <input
              className="input"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ej: Hospital X"
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Año de residencia</label>
            <select
              className="input"
              value={resYear}
              onChange={(e) => setResYear(e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="R1">R1</option>
              <option value="R2">R2</option>
              <option value="R3">R3</option>
              <option value="R4">R4</option>
              <option value="R5">R5</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Fecha</label>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <Badge
            ok={generalOk}
            text={generalOk ? "Datos generales completos" : "Faltan datos generales"}
          />
          <Badge
            ok={competenciesOk}
            text={
              competenciesOk
                ? "Subcompetencias completas"
                : `Faltan ${computed.missingCount} ítem(s)`
            }
          />
        </div>
      </div>

      <div className="card">
        <h2>Resumen</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>
              {computed.filledCount ? computed.total : "—"}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Ítems evaluados: {computed.filledCount}/{computed.totalItems}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Promedio</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>
              {computed.filledCount ? computed.avg.toFixed(2) : "—"}
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Escala: 1–9</div>
          </div>
        </div>
      </div>

      <h2>Competencias</h2>

      {COMPETENCIES.map((comp) => (
        <div key={comp.id} className="card">
          <h2>
            {comp.id}) {comp.title}
          </h2>

          {comp.items.map((it) => (
            <SubCompetencyCard
              key={it.key}
              code={it.key}
              title={it.title}
              description={it.description}
              value={scores[it.key]}
              onChange={(v) => setScore(it.key, v)}
              comment={comments[it.key]}
              onComment={(t) => setComment(it.key, t)}
            />
          ))}
        </div>
      ))}

      <div className="card">
        <h2>Acciones</h2>
        <p style={{ margin: "0 0 12px 0" }}>
          Para exportar, completá datos generales y todas las subcompetencias.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="btn"
            type="button"
            onClick={handleSaveSheets}
            disabled={!canExport}
            style={{
              opacity: canExport ? 1 : 0.5,
              cursor: canExport ? "pointer" : "not-allowed",
            }}
          >
            Guardar en Sheets
          </button>

          <button
            className="btn"
            type="button"
            onClick={handlePDF}
            disabled={!canExport}
            style={{
              opacity: canExport ? 1 : 0.5,
              cursor: canExport ? "pointer" : "not-allowed",
            }}
          >
            Generar PDF
          </button>
        </div>
      </div>
    </main>
  );
}