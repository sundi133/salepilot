import React from 'react';

interface AudioTableProps {
  audioLinks: string[] | undefined;
  questions:
    | { question: string; followUpDepth: number; traits: string }[]
    | undefined;
}

const AudioTable: React.FC<AudioTableProps> = ({ audioLinks, questions }) => {
  if (!audioLinks || !questions) {
    return null;
  }

  return (
    <table
      className="container min-w-full border-collapse border table-auto"
      style={{ marginTop: '16px' }}
    >
      <thead>
        <tr>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Question
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Audio
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Follow Up Depth
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            Skills to evaluate
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {audioLinks.map((audioLink, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              {index + 1}. {questions[index]?.question}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              <audio controls>
                <source
                  src={`/api/audio-proxy?audioLink=${encodeURIComponent(
                    audioLink
                  )}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              {questions[index]?.followUpDepth}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              {questions[index]?.traits}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AudioTable;
