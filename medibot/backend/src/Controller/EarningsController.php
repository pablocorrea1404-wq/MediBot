<?php

namespace App\Controller;

use App\Entity\Appointment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class EarningsController extends AbstractController
{
    #[Route('/api/earnings/export', name: 'api_earnings_export', methods: ['GET'])]
    public function export(EntityManagerInterface $em): Response
    {
        $today = new \DateTime();
        $startOfDay = clone $today;
        $startOfDay->setTime(0, 0, 0);
        $endOfDay = clone $today;
        $endOfDay->setTime(23, 59, 59);

        $appointments = $em->getRepository(Appointment::class)->createQueryBuilder('a')
            ->where('a.appointmentDate BETWEEN :start AND :end')
            ->setParameter('start', $startOfDay)
            ->setParameter('end', $endOfDay)
            ->getQuery()
            ->getResult();

        $rows = [];
        $rows[] = ['ID', 'Fecha', 'Paciente', 'Servicio', 'Precio', 'Estado'];

        $total = 0;
        foreach ($appointments as $app) {
            $price = $app->getService() ? $app->getService()->getPrice() : 0;
            $isPresented = ($app->getStatus() === 'presentado' || $app->getStatus() === 'confirmed');

            if ($isPresented) {
                $total += (float) $price;
            }

            $rows[] = [
                $app->getId(),
                $app->getAppointmentDate()->format('d/m/Y H:i'),
                $app->getPatient() ? $app->getPatient()->getName() : 'N/A',
                $app->getService() ? $app->getService()->getName() : 'General',
                $price . '€',
                $app->getStatus() . ($isPresented ? ' (Contabilizado)' : ' (No cobrado)')
            ];
        }

        $rows[] = ['', '', '', 'TOTAL', $total . '€', ''];

        $content = '';
        foreach ($rows as $row) {
            $content .= implode(';', $row) . "\n";
        }

        $response = new Response($content);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="ganancias_' . $today->format('Y-m-d') . '.csv"');

        return $response;
    }
}
