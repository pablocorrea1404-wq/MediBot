<?php

namespace App\Controller;

use App\Repository\AppointmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/availability')]
class AvailabilityController extends AbstractController
{
    #[Route('', name: 'app_availability', methods: ['GET'])]
    public function index(Request $request, AppointmentRepository $appointmentRepository): JsonResponse
    {
        $dateParam = $request->query->get('date');
        $staffId = $request->query->get('staffId');

        if (!$dateParam) {
            $dateParam = (new \DateTime())->format('Y-m-d');
        }

        try {
            $date = new \DateTime($dateParam);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid date format'], 400);
        }

        // Definir horario laboral
        $startHour = 9;
        $endHour = 17;
        $slots = [];

        // Buscar citas existentes para ese día
        $dayStart = clone $date;
        $dayStart->setTime(0, 0, 0);
        $dayEnd = clone $date;
        $dayEnd->setTime(23, 59, 59);

        // Query appointments for the day
        $queryBuilder = $appointmentRepository->createQueryBuilder('a')
            ->where('a.appointmentDate BETWEEN :start AND :end')
            ->setParameter('start', $dayStart)
            ->setParameter('end', $dayEnd);

        if ($staffId) {
            $queryBuilder->andWhere('a.staff = :staffId')
                ->setParameter('staffId', $staffId);
        }

        $appointments = $queryBuilder->getQuery()->getResult();
        $occupiedSlots = [];
        foreach ($appointments as $apt) {
            $occupiedSlots[] = $apt->getAppointmentDate()->format('H:00');
        }

        for ($i = $startHour; $i < $endHour; $i++) {
            $timeString = sprintf('%02d:00', $i);
            if (!in_array($timeString, $occupiedSlots)) {
                $slots[] = $timeString;
            }
        }

        return $this->json([
            'date' => $date->format('Y-m-d'),
            'staffId' => $staffId,
            'available_slots' => $slots
        ]);
    }
}
