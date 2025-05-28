import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Building2, Stethoscope, CheckCircle } from 'lucide-react';
import { Appointment } from '@/pages/Agent';

type AppointmentSectionProps = {
  appointments: Appointment[];
};

export default function AppointmentSection({ appointments }: AppointmentSectionProps) {
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-2"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-borderColor p-6">
        <h2 className="text-xl font-semibold text-blue mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Prochains rendez-vous
          {appointments.length > 0 && (
            <span className="ml-2 bg-blue text-white text-xs px-2 py-1 rounded-full">
              {appointments.length}
            </span>
          )}
        </h2>

        <AnimatePresence mode="wait">
          {appointments.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun rendez-vous trouvé</p>
              <p className="text-gray-400 text-sm mt-2">
                Utilisez la recherche pour trouver les prochains rendez-vous
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="appointments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-lightBlue to-white border border-borderColor rounded-xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue/10 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-blue">
                          {appointment.patient.social_number}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {appointment.patient.firstname} {appointment.patient.lastname}
                        </p>
                      </div>
                    </div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Confirmé</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Stethoscope className="w-4 h-4 text-blue" />
                      <span>
                        {appointment.doctor.firstname} {appointment.doctor.lastname}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building2 className="w-4 h-4 text-blue" />
                      <span>{appointment.departement.label}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue" />
                      <span>{formatDate(new Date(appointment.start_time))}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4 text-blue" />
                      <span className="font-medium">{formatTime(appointment.start_time)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Motif: {appointment.appointmentType.reason}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        Voir détails
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
