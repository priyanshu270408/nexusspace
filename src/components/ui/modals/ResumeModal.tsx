import React from 'react';
import { Download, FileText, Briefcase, GraduationCap, Award, CheckCircle2, Printer } from 'lucide-react';
import { RESUME_DATA, PROFILE_DATA } from '../../../data/spaceData';
import { sounds } from '../../../utils/soundEngine';

export const ResumeModal: React.FC = () => {
  const handleDownloadFile = () => {
    sounds.playClick();
    // Generate clean text-based markdown / printable mission file
    const missionFileContent = `
===================================================================
NEXUS MISSION DOSSIER // PROFESSIONAL RESUME
CALLSIGN: ${PROFILE_DATA.callsign}
NAME: ${PROFILE_DATA.name}
TITLE: ${PROFILE_DATA.title}
STATUS: ${PROFILE_DATA.status}
===================================================================

SUMMARY:
${RESUME_DATA.summary}

-------------------------------------------------------------------
EXPERIENCE:
-------------------------------------------------------------------
${RESUME_DATA.experience
  .map(
    (exp) => `
[${exp.period}] ${exp.role} @ ${exp.company}
${exp.points.map((pt) => `  * ${pt}`).join('\n')}
`
  )
  .join('\n')}

-------------------------------------------------------------------
EDUCATION:
-------------------------------------------------------------------
${RESUME_DATA.education
  .map(
    (edu) => `
${edu.degree}
${edu.school} (${edu.period})
${edu.details}
`
  )
  .join('\n')}

-------------------------------------------------------------------
CERTIFICATIONS & CREDENTIALS:
-------------------------------------------------------------------
${RESUME_DATA.certifications.map((c) => `* ${c}`).join('\n')}

===================================================================
TRANSMISSION RECORD VALIDATED // NEXUS-DEEP-SPACE-NETWORK
===================================================================
    `.trim();

    const blob = new Blob([missionFileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ALEX_VANCE_NEXUS_MISSION_DOSSIER.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Download Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-700">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            NEXUS COMMAND // OFFICIAL DOSSIER
          </h3>
          <p className="text-xs font-mono text-slate-400 m-0">
            Classified engineering service history & authenticated credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg glass-panel-subtle border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition cursor-pointer"
            title="Print Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00f3ff] to-[#38bdf8] hover:brightness-110 text-[#02040a] font-orbitron font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(0,243,255,0.4)] transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD MISSION FILE</span>
          </button>
        </div>
      </div>

      {/* Summary Abstract */}
      <div className="p-4 rounded-xl glass-panel-subtle border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-[#00f3ff] mb-2 uppercase">
          <FileText className="w-4 h-4" />
          <span>EXECUTIVE ABSTRACT</span>
        </div>
        <p className="text-xs sm:text-sm font-space text-slate-300 leading-relaxed m-0">
          {RESUME_DATA.summary}
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-[#38bdf8] uppercase">
          <Briefcase className="w-4 h-4" />
          <span>OPERATIONAL MISSION EXPERIENCE</span>
        </div>

        <div className="space-y-3">
          {RESUME_DATA.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl glass-panel-subtle border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-sm font-orbitron font-bold text-white m-0">
                    {exp.role}
                  </h4>
                  <div className="text-xs font-mono text-[#00f3ff]">
                    {exp.company}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {exp.period}
                </span>
              </div>

              <ul className="space-y-1.5 p-0 m-0 list-none text-xs font-space text-slate-300">
                {exp.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00f3ff] mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education */}
        <div className="p-4 rounded-xl glass-panel-subtle border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-[#c084fc] mb-3 uppercase">
            <GraduationCap className="w-4 h-4" />
            <span>ACADEMIC FOUNDATION</span>
          </div>

          {RESUME_DATA.education.map((edu, idx) => (
            <div key={idx} className="space-y-1">
              <h5 className="text-xs font-orbitron font-bold text-white m-0">
                {edu.degree}
              </h5>
              <div className="text-xs font-mono text-purple-300">
                {edu.school} // {edu.period}
              </div>
              <p className="text-xs font-space text-slate-400 m-0 pt-1">
                {edu.details}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="p-4 rounded-xl glass-panel-subtle border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-[#06d6a0] mb-3 uppercase">
            <Award className="w-4 h-4" />
            <span>VERIFIED CERTIFICATIONS</span>
          </div>

          <div className="space-y-2">
            {RESUME_DATA.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#06d6a0] shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
